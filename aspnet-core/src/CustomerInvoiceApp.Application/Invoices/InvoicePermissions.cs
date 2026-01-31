namespace CustomerInvoiceApp.Invoices
{
    public static class InvoicePermissions
    {
        // Group name for the module
        public const string GroupName = "Invoices";

        // CRUD permissions
        public const string Create = GroupName + ".Create";
        public const string Update = GroupName + ".Update";
        public const string Delete = GroupName + ".Delete";
        public const string View = GroupName + ".View";

        // Custom permission for updating invoice status
        public const string UpdateStatus = GroupName + ".UpdateStatus";
    }
}
