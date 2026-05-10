package programming.itmo.beans;

import com.google.gson.Gson;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedProperty;
import javax.faces.context.FacesContext;
import lombok.Getter;
import lombok.Setter;
import org.primefaces.PrimeFaces;
import programming.itmo.model.PointDTO;
import programming.itmo.util.CheckAreaUtil;

@Setter
@Getter
public class PointsBean implements Serializable {

    @ManagedProperty("#{checkAreaUtil}")
    private CheckAreaUtil checkAreaUtil;

    private BigDecimal x;
    private BigDecimal y;
    private Map<String, Boolean> xList;
    private BigDecimal r;
    private BigDecimal hiddenR;
    private BigDecimal currentMaxR;
    private boolean inArea;
    private String hiddenX;
    private String hiddenY;


    @PostConstruct
    public void init() {
        xList = new LinkedHashMap<>();
        for (int i = -5; i <= 1; i++) {
            xList.put(String.valueOf(i), false);
        }
    }

    public void check() {
        boolean bulletHit = false;
        
        try {
            // Получаем значения из скрытых полей или основных полей
            BigDecimal yValue = (hiddenY != null && !hiddenY.isEmpty()) 
                ? new BigDecimal(hiddenY) : y;
            
            // Определяем R (hiddenR приоритетнее для клика по графику)
            BigDecimal rValue = (hiddenR != null && hiddenR.compareTo(BigDecimal.ZERO) != 0) 
                ? hiddenR : r;
            
            if (yValue != null && rValue != null) {
                // Если hiddenX задан (из чекбоксов), обрабатываем все X
                if (hiddenX != null && !hiddenX.isEmpty()) {
            String[] xs = hiddenX.split(",");
            for (String xStr : xs) {
                xStr = xStr.trim();
                if (!xStr.isEmpty()) {
                        BigDecimal currentX = new BigDecimal(xStr);
                            boolean pointInArea = checkAreaUtil.process(currentX, yValue, rValue);
                            if (pointInArea) bulletHit = true;
                        }
                    }
                }
            }
        } catch (NumberFormatException e) {
            bulletHit = false;
        }

        PrimeFaces.current().ajax().addCallbackParam("bulletHit", bulletHit);
    }
    public void resetXList() {
        for (String key : xList.keySet()) {
            xList.put(key, false);
        }
        hiddenX = "";
    }

    public void resetY() {
        this.y = null;
        this.hiddenY = "";
    }

    public void updateFilteredPoints() {
        List<PointDTO> allPoints = checkAreaUtil.getPointRepository().getAllPoints();
        // пересчитываем попадание точек с текущим максимальным R
        if (currentMaxR != null && currentMaxR.compareTo(BigDecimal.ZERO) > 0) {
            allPoints.forEach(p -> {
                p.setInArea(checkAreaUtil.check(p.getX(), p.getY(), currentMaxR));
            });
        }
        String json = new Gson().toJson(allPoints);
        PrimeFaces.current().ajax().addCallbackParam("pointsJson", json);
    }
    
    public void setCurrentMaxR() {
        FacesContext context = FacesContext.getCurrentInstance();
        String maxRParam = context.getExternalContext().getRequestParameterMap().get("maxR");
        if (maxRParam != null && !maxRParam.isEmpty()) {
            try {
                this.currentMaxR = new BigDecimal(maxRParam);
            } catch (NumberFormatException e) {
                this.currentMaxR = BigDecimal.ZERO;
            }
        } else {
            this.currentMaxR = BigDecimal.ZERO;
        }
    }



    public void resetHiddenR() {
        hiddenR = BigDecimal.ZERO;
    }

    public List<PointDTO> getAllPoints() {
        return checkAreaUtil.getPointRepository().getAllPoints();
    }

    public List<PointDTO> getReversedPoints() {
        List<PointDTO> points = getAllPoints();
        java.util.Collections.reverse(points);
        return points;
    }

    public Object getxList() {
        return xList;
    }
}
