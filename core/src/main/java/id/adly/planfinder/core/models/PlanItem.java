package id.adly.planfinder.core.models;

import java.util.Collections;
import java.util.List;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(
    adaptables = Resource.class,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class PlanItem {

    @ValueMapValue
    private String id;

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String category;

    @ValueMapValue
    private String badge;

    @ValueMapValue
    private Long monthlyRate;

    @ValueMapValue
    private String roomLimit;

    @ValueMapValue
    private String annualLimit;

    @ValueMapValue
    private String ctaLabel;

    @ValueMapValue
    private String ctaLink;

    @ValueMapValue
    private boolean featured;

    @ValueMapValue
    private List<String> features;

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category != null && !category.isEmpty() ? category : "health";
    }

    public String getBadge() {
        return badge;
    }

    public long getMonthlyRate() {
        return monthlyRate != null ? monthlyRate : 0L;
    }

    public String getRoomLimit() {
        return roomLimit;
    }

    public String getAnnualLimit() {
        return annualLimit;
    }

    public String getCtaLabel() {
        return ctaLabel != null && !ctaLabel.isEmpty() ? ctaLabel : "Select Plan";
    }

    public String getCtaLink() {
        return ctaLink;
    }

    public boolean isFeatured() {
        return featured;
    }

    public List<String> getFeatures() {
        return features != null ? Collections.unmodifiableList(features) : Collections.emptyList();
    }
}
