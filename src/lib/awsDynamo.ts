import https from 'https';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export const TABLE_NAME = 'CampusConnect_Listings';

function getCredentials() {
  let accessKey = process.env.AWS_ACCESS_KEY_ID;
  let secretKey = process.env.AWS_SECRET_ACCESS_KEY;
  let region = process.env.AWS_REGION || 'us-west-2';

  if (!accessKey || !secretKey) {
    try {
      const userProfile = process.env.USERPROFILE || process.env.HOME || '';
      const credPath = path.join(userProfile, '.aws', 'credentials');
      if (fs.existsSync(credPath)) {
        const content = fs.readFileSync(credPath, 'utf8');
        const idMatch = content.match(/aws_access_key_id\s*=\s*(.+)/);
        const secretMatch = content.match(/aws_secret_access_key\s*=\s*(.+)/);
        if (idMatch) accessKey = idMatch[1].trim();
        if (secretMatch) secretKey = secretMatch[1].trim();
      }
    } catch {
      // ignore
    }
  }

  return {
    accessKey: accessKey || '',
    secretKey: secretKey || '',
    region,
  };
}

function hmac(key: string | Buffer, str: string, encoding?: crypto.BinaryToTextEncoding) {
  const h = crypto.createHmac('sha256', key).update(str, 'utf8');
  return encoding ? h.digest(encoding) : h.digest();
}

function hash(str: string): string {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

export async function callDynamoDB(target: string, payload: any): Promise<any> {
  const { accessKey, secretKey, region } = getCredentials();
  const host = `dynamodb.${region}.amazonaws.com`;
  const service = 'dynamodb';

  const body = JSON.stringify(payload);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);

  const canonicalHeaders = `content-type:application/x-amz-json-1.0\nhost:${host}\nx-amz-date:${amzDate}\nx-amz-target:DynamoDB_20120810.${target}\n`;
  const signedHeaders = 'content-type;host;x-amz-date;x-amz-target';
  const payloadHash = hash(body);

  const canonicalRequest = `POST\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${hash(canonicalRequest)}`;

  const kDate = hmac('AWS4' + secretKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, 'aws4_request');
  const signature = hmac(kSigning, stringToSign, 'hex');

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return new Promise((resolve, reject) => {
    const req = https.request(
      `https://${host}/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.0',
          'x-amz-date': amzDate,
          'x-amz-target': `DynamoDB_20120810.${target}`,
          Authorization: authorizationHeader,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(`AWS Error [${res.statusCode}]: ${parsed.message || parsed.__type || data}`));
            }
          } catch (e) {
            reject(new Error(`Invalid JSON: ${data}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

export function unmarshalItem(item: Record<string, any>): any {
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(item)) {
    if (val.S !== undefined) result[key] = val.S;
    else if (val.N !== undefined) result[key] = Number(val.N);
    else if (val.BOOL !== undefined) result[key] = val.BOOL;
    else result[key] = val;
  }
  return result;
}
