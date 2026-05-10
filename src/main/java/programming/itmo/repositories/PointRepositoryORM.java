package programming.itmo.repositories;

import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import lombok.Getter;
import lombok.Setter;
import programming.itmo.entities.PointEntity;
import programming.itmo.model.PointDTO;

@Getter
@Setter
public class PointRepositoryORM implements PointRepository{
    private EntityManager entityManager;

    public PointRepositoryORM() {
        EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory(
                "pointsPU");
        entityManager = entityManagerFactory.createEntityManager();
    }
    @Override
    public void save(PointDTO pointDTO) {
        entityManager.getTransaction().begin();
        PointEntity entity = new PointEntity(pointDTO.getX(), pointDTO.getY(), pointDTO.getR(),
                pointDTO.isInArea());
        entityManager.persist(entity);
        entityManager.getTransaction().commit();
    }

    @Override
    public List<PointDTO> getAllPoints() {
        List<PointEntity> entities = entityManager.createQuery("select e from PointEntity e",
                PointEntity.class).getResultList();

        return entities.stream().map(e -> new PointDTO(e.getX(), e.getY(), e.getR(),
                e.isInArea())).collect(Collectors.toList());
    }
}
