using Xunit;

namespace CustomerInvoiceApp.EntityFrameworkCore;

[CollectionDefinition(CustomerInvoiceAppTestConsts.CollectionDefinitionName)]
public class CustomerInvoiceAppEntityFrameworkCoreCollection : ICollectionFixture<CustomerInvoiceAppEntityFrameworkCoreFixture>
{

}
