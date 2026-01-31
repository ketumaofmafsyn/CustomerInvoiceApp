using Volo.Abp.Settings;

namespace CustomerInvoiceApp.Settings;

public class CustomerInvoiceAppSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(CustomerInvoiceAppSettings.MySetting1));
    }
}
