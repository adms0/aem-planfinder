package id.adly.planfinder.core.models.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import id.adly.planfinder.core.models.PlanComparisonModel;
import id.adly.planfinder.core.models.PlanItem;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(AemContextExtension.class)
class PlanComparisonModelImplTest {

    private final AemContext context = new AemContext();

    @BeforeEach
    void setUp() {
        context.addModelsForClasses(PlanComparisonModelImpl.class, PlanItem.class);

        String fixtureJson = "{"
            + "\"jcr:primaryType\": \"nt:unstructured\","
            + "\"sling:resourceType\": \"planfinder/components/plan-comparison\","
            + "\"heading\": \"Compare Protection Plans\","
            + "\"subheading\": \"Flexible coverage for individuals and families.\","
            + "\"defaultCycle\": \"monthly\","
            + "\"annualDiscountPercent\": 15,"
            + "\"currencyCode\": \"IDR\","
            + "\"plans\": {"
            + "  \"jcr:primaryType\": \"nt:unstructured\","
            + "  \"item0\": {"
            + "    \"jcr:primaryType\": \"nt:unstructured\","
            + "    \"id\": \"primacare-essential\","
            + "    \"title\": \"PrimaCare Essential\","
            + "    \"category\": \"health\","
            + "    \"monthlyRate\": 420000,"
            + "    \"roomLimit\": \"IDR 1,500,000 / day\","
            + "    \"annualLimit\": \"IDR 1,500,000,000\","
            + "    \"featured\": false,"
            + "    \"features\": [\"Cashless admission\", \"Inpatient surgery\"]"
            + "  },"
            + "  \"item1\": {"
            + "    \"jcr:primaryType\": \"nt:unstructured\","
            + "    \"id\": \"primacare-plus\","
            + "    \"title\": \"PrimaCare Plus\","
            + "    \"category\": \"health\","
            + "    \"badge\": \"Most Selected\","
            + "    \"monthlyRate\": 780000,"
            + "    \"roomLimit\": \"IDR 3,000,000 / day\","
            + "    \"annualLimit\": \"IDR 4,000,000,000\","
            + "    \"featured\": true,"
            + "    \"features\": [\"Private room\", \"Regional coverage\"]"
            + "  }"
            + "}"
            + "}";

        context.load().json(
            new ByteArrayInputStream(fixtureJson.getBytes(StandardCharsets.UTF_8)),
            "/content/planfinder/test/plan-comparison"
        );
    }

    @Test
    void loadsAuthoredPlansAndPricingConfig() {
        Resource resource = context.resourceResolver().getResource("/content/planfinder/test/plan-comparison");
        PlanComparisonModel model = resource.adaptTo(PlanComparisonModel.class);

        assertEquals("Compare Protection Plans", model.getHeading());
        assertEquals(15, model.getAnnualDiscountPercent());
        assertEquals("IDR", model.getCurrencyCode());
        assertFalse(model.isEmpty());
        assertEquals(2, model.getPlans().size());
        assertEquals("PrimaCare Plus", model.getPlans().get(1).getTitle());
        assertTrue(model.getPlans().get(1).isFeatured());
    }

    @Test
    void reportsEmptyWhenNoPlansAuthored() {
        Resource emptyResource = context.create().resource(
            "/content/planfinder/test/empty-comparison",
            "sling:resourceType", PlanComparisonModelImpl.RESOURCE_TYPE,
            "heading", "Empty State"
        );
        PlanComparisonModel model = emptyResource.adaptTo(PlanComparisonModel.class);

        assertTrue(model.isEmpty());
        assertEquals(0, model.getPlans().size());
    }
}
