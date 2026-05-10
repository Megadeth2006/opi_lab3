package programming.itmo.util;

import java.io.Serializable;
import java.math.BigDecimal;
import java.math.MathContext;
import javax.faces.bean.ManagedProperty;
import lombok.Getter;
import lombok.Setter;
import programming.itmo.model.PointDTO;
import programming.itmo.repositories.PointRepository;

@Getter
@Setter
public class CheckAreaUtil implements Serializable {

    @ManagedProperty("#{pointRepository}")
    private PointRepository pointRepository;

    public boolean process(BigDecimal x, BigDecimal y, BigDecimal r) {
        boolean result = check(x, y, r);
        PointDTO pointDTO = new PointDTO(x, y, r, result);
        pointRepository.save(pointDTO);
        return result;
    }

    public boolean check(BigDecimal x, BigDecimal y, BigDecimal r) {
        BigDecimal r2 = r.divide(BigDecimal.valueOf(2), MathContext.DECIMAL128);

        // Прямоугольник (I четверть: x > 0, y > 0)
        // От 0 до R по X, от 0 до R/2 по Y
        if (x.compareTo(BigDecimal.ZERO) >= 0 && y.compareTo(BigDecimal.ZERO) >= 0) {
            if (x.compareTo(r) <= 0 && y.compareTo(r2) <= 0) return true;
        }
        
        // Четверть окружности (IV четверть: x > 0, y < 0)
        // Радиус R/2: x² + y² <= (R/2)²
        else if (x.compareTo(BigDecimal.ZERO) >= 0 && y.compareTo(BigDecimal.ZERO) <= 0) {
            if (x.multiply(x).add(y.multiply(y)).compareTo(r2.multiply(r2)) <= 0) return true;
        }
        
        // Треугольник (II четверть: x < 0, y > 0)
        // Вершины: (0,0), (-R,0), (0,R)
        // Линия от (-R,0) до (0,R): y = x + R, условие y <= x + R
        else if (x.compareTo(BigDecimal.ZERO) <= 0 && y.compareTo(BigDecimal.ZERO) >= 0) {
            if (y.subtract(x).compareTo(r) <= 0) return true;
        }
        
        return false;
    }


}
