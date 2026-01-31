using CustomerInvoiceApp.Samples;
using Xunit;

namespace CustomerInvoiceApp.EntityFrameworkCore.Applications;

[Collection(CustomerInvoiceAppTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<CustomerInvoiceAppEntityFrameworkCoreTestModule>
{

}
