import { logger } from './logger';

export class PaymentService {
    async processPayment(amount: number) {
        logger.info("Processing payment");
        this.validate(amount);
    }

    private validate(amount: number) {
        if (amount <= 0) throw new Error("Invalid amount");
    }

    test2() {
        console.log("this is another test")
    }
}