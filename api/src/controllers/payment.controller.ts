import { Request, Response } from 'express';
import crypto from 'crypto';
import { razorpay } from '../config/razorpay';
import { env } from '../config/env';
import prisma from '../config/database';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const amount = 100 * 100; // 100 INR in paise
        const currency = 'INR';

        const options = {
            amount,
            currency,
            receipt: `rcpt_${userId}_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        // Save pending payment
        await prisma.payment.create({
            data: {
                orderId: order.id,
                amount: 100, // INR
                currency: order.currency,
                receipt: order.receipt,
                userId: userId,
                status: 'PENDING'
            }
        });

        return res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Create Order Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to create order' });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing fields' });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update payment and user credits in a transaction
            await prisma.$transaction([
                prisma.payment.update({
                    where: { orderId: razorpay_order_id },
                    data: {
                        paymentId: razorpay_payment_id,
                        signature: razorpay_signature,
                        status: 'SUCCESS'
                    }
                }),
                prisma.user.update({
                    where: { id: userId },
                    data: {
                        propertyCredits: { increment: 1 }
                    }
                })
            ]);

            return res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            // Signature mismatch, but update status to failed
            await prisma.payment.update({
                where: { orderId: razorpay_order_id },
                data: {
                    status: 'FAILED',
                    paymentId: razorpay_payment_id,
                    signature: razorpay_signature
                }
            });
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Verify Payment Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to verify payment' });
    }
};
