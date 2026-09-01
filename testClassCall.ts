import {PaymentService} from "./test";
import { logger, delogger } from './logger';

function testClassCall() {
    const ps = new PaymentService();
    ps.processPayment(10);
    ps.test2()
    logger.info("res")
    return ""
}

export default testClassCall