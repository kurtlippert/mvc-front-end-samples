namespace PC.RMS.Web.Kendo.Mvc.UI.Fluent
{
    using System;

    using global::Kendo.Mvc.UI.Fluent;

    /// <summary>
    /// The ComboBoxBuilderExtensions class.
    /// </summary>
    public static class ComboBoxBuilderExtensions
    {
        public static ComboBoxBuilder ConditionallyCascadeFrom(this ComboBoxBuilder builder, string cascadeFromId, bool condition)
        {
            if (condition)
            {
                builder.CascadeFrom(cascadeFromId);
            }

            return builder;
        }

        public static ComboBoxBuilder ConditionalChange(this ComboBoxBuilder builder, Func<object, object> handler, bool condition)
        {
            if (condition)
            {
                builder.Events(e => e.Change(handler));
            }

            return builder;
        }

        public static ComboBoxBuilder ConditionalChange(this ComboBoxBuilder builder, string handler, bool condition)
        {
            if (condition)
            {
                builder.Events(e => e.Change(handler));
            }

            return builder;
        }
    }
}
