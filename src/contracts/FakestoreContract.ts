export interface FakestoreContract {
    id: number;
    title: string;
    image: string;
    price: number;
    description: string;
    quantity: number;
    rating: { rate: number, count: 0 }
}