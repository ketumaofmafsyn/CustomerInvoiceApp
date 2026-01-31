using CustomerInvoiceApp.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace CustomerInvoiceApp.Permissions;

public class CustomerInvoiceAppPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(
            CustomerInvoiceAppPermissions.GroupName,
            L("Permission:CustomerInvoiceApp")
        );

        var customersPermission = myGroup.AddPermission(
            CustomerInvoiceAppPermissions.Customers.Default,
            L("Permission:Customers")
        );

        customersPermission.AddChild(
            CustomerInvoiceAppPermissions.Customers.Create,
            L("Permission:Customers.Create")
        );

        customersPermission.AddChild(
            CustomerInvoiceAppPermissions.Customers.Edit,
            L("Permission:Customers.Edit")
        );

        customersPermission.AddChild(
            CustomerInvoiceAppPermissions.Customers.Delete,
            L("Permission:Customers.Delete")
        );

        var invoicesPermission = myGroup.AddPermission(
            CustomerInvoiceAppPermissions.Invoices.Default,
            L("Permission:Invoices")
        );

        invoicesPermission.AddChild(
            CustomerInvoiceAppPermissions.Invoices.Create,
            L("Permission:Invoices.Create")
        );

        invoicesPermission.AddChild(
            CustomerInvoiceAppPermissions.Invoices.Edit,
            L("Permission:Invoices.Edit")
        );

        invoicesPermission.AddChild(
            CustomerInvoiceAppPermissions.Invoices.Delete,
            L("Permission:Invoices.Delete")
        );
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<CustomerInvoiceAppResource>(name);
    }
}
