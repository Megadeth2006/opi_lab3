package programming.itmo.model;

import java.io.Serializable;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PointDTO implements Serializable {
    private BigDecimal x;
    private BigDecimal y;
    private BigDecimal r;
    private boolean inArea;
}
