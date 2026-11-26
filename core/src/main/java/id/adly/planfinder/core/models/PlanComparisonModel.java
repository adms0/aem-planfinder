package id.adly.planfinder.core.models;

import com.adobe.cq.export.json.ComponentExporter;
import java.util.List;

public interface PlanComparisonModel extends ComponentExporter {

    String getHeading();

    String getSubheading();

    String getDefaultCycle();

    int getAnnualDiscountPercent();

    String getCurrencyCode();

    String getDisclaimer();

    List<PlanItem> getPlans();

    boolean isEmpty();
}
