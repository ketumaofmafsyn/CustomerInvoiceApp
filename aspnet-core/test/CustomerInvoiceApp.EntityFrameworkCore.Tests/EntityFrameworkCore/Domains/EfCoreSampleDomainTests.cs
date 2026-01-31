using CustomerInvoiceApp.Samples;
using Xunit;

namespace CustomerInvoiceApp.EntityFrameworkCore.Domains;

[Collection(CustomerInvoiceAppTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<CustomerInvoiceAppEntityFrameworkCoreTestModule>
{

}
