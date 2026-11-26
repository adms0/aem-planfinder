package id.adly.planfinder.core.models.impl;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import id.adly.planfinder.core.models.PlanComparisonModel;
import id.adly.planfinder.core.models.PlanItem;
import java.util.Collections;
import java.util.List;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(
    adaptables = {SlingHttpServletRequest.class, Resource.class},
    adapters = {PlanComparisonModel.class, ComponentExporter.class},
    resourceType = PlanComparisonModelImpl.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION
)
public class PlanComparisonModelImpl implements PlanComparisonModel {

    public static final String RESOURCE_TYPE = "planfinder/components/plan-comparison";

    @ValueMapValue
    private String heading;

    @ValueMapValue
    private String subheading;

    @ValueMapValue
    @Default(values = "monthly")
    private String defaultCycle;

    @ValueMapValue
    @Default(intValues = 15)
    private int annualDiscountPercent;

    @ValueMapValue
    @Default(values = "IDR")
    private String currencyCode;

    @ValueMapValue
    private String disclaimer;

    @ChildResource(name = "plans")
    private List<PlanItem> plans;

    @Override
    public String getHeading() {
        return heading;
    }

    @Override
    public String getSubheading() {
        return subheading;
    }

    @Override
    public String getDefaultCycle() {
        return defaultCycle != null && !defaultCycle.isEmpty() ? defaultCycle : "monthly";
    }

    @Override
    public int getAnnualDiscountPercent() {
        return annualDiscountPercent;
    }

    @Override
    public String getCurrencyCode() {
        return currencyCode != null && !currencyCode.isEmpty() ? currencyCode : "IDR";
    }

    @Override
    public String getDisclaimer() {
        return disclaimer;
    }

    @Override
    public List<PlanItem> getPlans() {
        return plans != null ? Collections.unmodifiableList(plans) : Collections.emptyList();
    }

    @Override
    public boolean isEmpty() {
        return plans == null || plans.isEmpty();
    }

    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }
}
