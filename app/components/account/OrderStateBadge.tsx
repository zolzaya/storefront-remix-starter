// Copied from https://www.vendure.io/docs/typescript-api/orders/order-state/
type OrderState = | 'Created'
    | 'Draft'
    | 'AddingItems'
    | 'ArrangingPayment'
    | 'PaymentAuthorized'
    | 'PaymentSettled'
    | 'PartiallyShipped'
    | 'Shipped'
    | 'PartiallyDelivered'
    | 'Delivered'
    | 'Modifying'
    | 'ArrangingAdditionalPayment'
    | 'Cancelled'

// Lookup can be replaced once theres i18n support, for now simply pick with a fallback
const map = new Map<string, string>([
    ['Draft', 'Draft'],
    ['AddingItems', 'Adding items'],
    ['ArrangingPayment', 'Төлбөр хүлээгдэж байгаа'],            // Awaiting payment
    ['PaymentAuthorized', 'Төлбөр шалгаж байгаа'],              // Payment authorized
    ['PaymentSettled', 'Төлбөр төлөгдсөн'],                     // Payment settled
    ['PartiallyShipped', 'Хэсэгчлэн хүргэлтэнд гарсан'],        // Partially shipped
    ['Shipped', 'Хүргэлтэнд гарсан'],                           // Shipped
    ['PartiallyDelivered', 'Хэсэгчлэн хүргэгдсэн'],             // Partially delivered
    ['Delivered', 'Хүргэж өгсөн'],                              // Delivered
    ['Modifying', 'Өөрчлөгдөж байгаа'],                         // Modifying
    ['ArrangingAdditionalPayment', 'Төлбөр хүлээж буй'],        // Awaiting payment
    ['Cancelled', 'Цуцлагдсан'],                                // Cancelled
    ['Unknown', 'Unknown'],                                     // Unknown 
]);

export function OrderStateBadge({ state }: { state?: string }) {
    
    let label = map.get(state ?? "Unknown") ?? "Unknown";
    let colorClasses = '';
    switch (state as OrderState) {
        default:
        case "Draft":
        case "AddingItems":
            colorClasses = "bg-gray-100 text-gray-800";
            break;
        case "PaymentAuthorized":
        case "PaymentSettled":
        case "Shipped":
            colorClasses = "bg-blue-100 text-blue-800";
            break;
        case "Delivered":
            colorClasses = "bg-green-100 text-green-800";
            break;
        case "PartiallyShipped":
        case "PartiallyDelivered":
        case "Modifying":
        case "ArrangingPayment":
        case "ArrangingAdditionalPayment":
            colorClasses = "bg-yellow-100 text-yellow-800";
            break;
        case "Cancelled":
            colorClasses = "bg-red-100 text-red-800";
            break;
    }

    return (
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded uppercase whitespace-nowrap ${colorClasses}`}>{label}</span>
    );

}
