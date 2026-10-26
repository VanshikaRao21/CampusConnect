import { NextRequest, NextResponse } from 'next/server';
import { callDynamoDB, unmarshalItem, TABLE_NAME } from '@/lib/awsDynamo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await callDynamoDB('Scan', { TableName: TABLE_NAME });
    const items = (data.Items || []).map(unmarshalItem);
    // Sort by createdAt descending
    items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ success: true, count: items.length, data: items, source: 'AWS DynamoDB (us-west-2)' });
  } catch (error: any) {
    console.error('DynamoDB Scan Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const dynamoItem: Record<string, any> = {
      id: { S: id },
      title: { S: body.title || '' },
      description: { S: body.description || '' },
      category: { S: body.category || 'Other' },
      price: { N: String(body.price || 0) },
      condition: { S: body.condition || 'Good' },
      status: { S: body.status || 'ACTIVE' },
      imagePath: { S: body.imagePath || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
      owner: { S: body.owner || 'user_student_demo' },
      sellerId: { S: body.sellerId || body.owner || 'user_student_demo' },
      sellerEmail: { S: body.sellerEmail || body.contactEmail || 'student@college.edu' },
      contactEmail: { S: body.contactEmail || 'student@college.edu' },
      contactPhone: { S: body.contactPhone || '+91 98765 43210' },
      createdAt: { S: body.createdAt || now },
      updatedAt: { S: now },
    };

    if (body.s3Key) {
      dynamoItem.s3Key = { S: body.s3Key };
    }

    await callDynamoDB('PutItem', {
      TableName: TABLE_NAME,
      Item: dynamoItem,
    });

    const created = unmarshalItem(dynamoItem);
    return NextResponse.json({ success: true, data: created, source: 'AWS DynamoDB (us-west-2)' }, { status: 201 });
  } catch (error: any) {
    console.error('DynamoDB PutItem Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing listing id' }, { status: 400 });

    await callDynamoDB('DeleteItem', {
      TableName: TABLE_NAME,
      Key: { id: { S: id } },
    });

    return NextResponse.json({ success: true, deletedId: id, source: 'AWS DynamoDB (us-west-2)' });
  } catch (error: any) {
    console.error('DynamoDB DeleteItem Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
