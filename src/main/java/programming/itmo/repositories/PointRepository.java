package programming.itmo.repositories;

import java.util.List;
import programming.itmo.model.PointDTO;

public interface PointRepository {
    void save(PointDTO pointDTO);
    List<PointDTO> getAllPoints();
}
