package programming.itmo.util;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CheckAreaUtilTest {

    private final CheckAreaUtil checkAreaUtil = new CheckAreaUtil();

    @Test
    void rectanglePointShouldBeInsideArea() {
        assertTrue(checkAreaUtil.check(
                new BigDecimal("1"),
                new BigDecimal("1"),
                new BigDecimal("2")
        ));
    }

    @Test
    void circleQuarterPointShouldBeInsideArea() {
        assertTrue(checkAreaUtil.check(
                new BigDecimal("0.5"),
                new BigDecimal("-0.5"),
                new BigDecimal("2")
        ));
    }

    @Test
    void triangleConstraintShouldRejectPointOutsideArea() {
        assertFalse(checkAreaUtil.check(
                new BigDecimal("-2"),
                new BigDecimal("2"),
                new BigDecimal("1")
        ));
    }
}
