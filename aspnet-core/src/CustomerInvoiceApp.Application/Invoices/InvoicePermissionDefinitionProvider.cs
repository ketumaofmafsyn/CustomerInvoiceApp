using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using CustomerInvoiceApp.Localization; // <-- FIXED: correct namespace for CustomerInvoiceAppResource

namespace CustomerInvoiceApp.Invoices
{
    public class InvoicePermissionDefinitionProvider : PermissionDefinitionProvider
    {
        public override void Define(IPermissionDefinitionContext context)
        {
            // Create a permission group for invoices
            var invoiceGroup = context.AddGroup(InvoicePermissions.GroupName, L("Permission:Invoices"));

            invoiceGroup.AddPermission(InvoicePermissions.Create, L("Permission:Create"));
            invoiceGroup.AddPermission(InvoicePermissions.Update, L("Permission:Update"));
            invoiceGroup.AddPermission(InvoicePermissions.Delete, L("Permission:Delete"));
            invoiceGroup.AddPermission(InvoicePermissions.View, L("Permission:View"));
            invoiceGroup.AddPermission(InvoicePermissions.UpdateStatus, L("Permission:UpdateStatus"));
        }

        private static LocalizableString L(string name)
        {
            // Use the correct resource class
            return LocalizableString.Create<CustomerInvoiceAppResource>(name);
        }
    }
}
