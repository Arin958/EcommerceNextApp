import { Notification, Order, User } from "@/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await context.params;
        const {userId} = await auth();
        if(!userId) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }


        const user = await User.findOne({clerkId: userId});

        if(!user) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }

        if(user.role !== "admin") {
            return NextResponse.json({message: "Unauthorized"}, {status: 403})
        }

            const admin = await User.findOne({ clerkId: userId });
    if (!admin) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (admin.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }


        const body = await req.json();
        const {orderStatus, paymentStatus} = body;

        if(!orderStatus && !paymentStatus) {
            return NextResponse.json({message: "Please provide at least one field to update"}, {status: 400})
        }

        const order = await Order.findById(id);

        if(!order) {
            return NextResponse.json({message: "Order not found"}, {status: 404})
        }


        if(orderStatus) order.orderStatus = orderStatus;
        if(paymentStatus) order.paymentStatus = paymentStatus;


        await order.save();
          // 🔹 Find the user who placed the order
    const recipient = await User.findOne({ clerkId: order.clerkId });
    if (!recipient) {
      return NextResponse.json(
        { message: "Recipient user not found" },
        { status: 404 }
      );
    }

    // 🔹 Determine notification type and message
    let type = "system";
    let title = "Order Update";
    let message = `Your order (${order.orderId}) has been updated.`;

    if (orderStatus) {
      switch (orderStatus) {
        case "confirmed":
          type = "order_confirmed";
          title = "Order Confirmed";
          message = `Your order (${order.orderId}) has been confirmed.`;
          break;
        case "processing":
          type = "order_processing";
          title = "Order Processing";
          message = `Your order (${order.orderId}) is now being processed.`;
          break;
        case "shipped":
          type = "order_shipped";
          title = "Order Shipped";
          message = `Your order (${order.orderId}) has been shipped.`;
          break;
        case "out_for_delivery":
          type = "order_out_for_delivery";
          title = "Out for Delivery";
          message = `Your order (${order.orderId}) is out for delivery.`;
          break;
        case "delivered":
          type = "order_delivered";
          title = "Order Delivered";
          message = `Your order (${order.orderId}) has been delivered.`;
          break;
        case "cancelled":
          type = "order_cancelled";
          title = "Order Cancelled";
          message = `Your order (${order.orderId}) has been cancelled.`;
          break;
        case "returned":
          type = "order_returned";
          title = "Order Returned";
          message = `Your order (${order.orderId}) has been returned.`;
          break;
      }
    } else if (paymentStatus) {
      switch (paymentStatus) {
        case "paid":
          type = "payment_success";
          title = "Payment Successful";
          message = `Your payment for order (${order.orderId}) was successful.`;
          break;
        case "failed":
          type = "payment_failed";
          title = "Payment Failed";
          message = `Your payment for order (${order.orderId}) has failed.`;
          break;
        case "refunded":
          type = "payment_refunded";
          title = "Payment Refunded";
          message = `Your payment for order (${order.orderId}) has been refunded.`;
          break;
      }
    }

    // 🔹 Create Notification
    await Notification.create({
      recipient: {
        _id: recipient._id.toString(),
        clerkId: recipient.clerkId,
        username: recipient.username,
        email: recipient.email,
        role: recipient.role,
      },
      sender: {
        _id: admin._id.toString(),
        clerkId: admin.clerkId,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
      type,
      title,
      message,
      orderId: order.orderId,
      url: `/orders/${order.orderId}`,
    });
        return NextResponse.json({message: "Order updated successfully"}, {status: 200})



    } catch (error: unknown) {
        let msg = 'Something went wrong'
        if(typeof error === 'string') msg = error
        else if(error instanceof Error) msg = error.message
        return NextResponse.json({message: msg}, {status: 500})
        
    }
}