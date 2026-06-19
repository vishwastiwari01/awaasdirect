import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify-payment', authenticate, verifyPayment);

export default router;
