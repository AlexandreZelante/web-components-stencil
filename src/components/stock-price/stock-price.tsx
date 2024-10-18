import { Element, h, Prop, State } from "@stencil/core";
import { Component } from "@stencil/core";

@Component({
    tag: 'stock-price',
    styleUrl: './stock-price.css',
    shadow: true
})
export class StockPrice {
    @Element() el: HTMLElement;
    @State() stocks = [];
    @State() stockUserInput: string;
    @State() stockInputValid: boolean = false;
    @State() error: string;
    @Prop() stockTitle: string;

    stockInput: HTMLInputElement;

    onUserInput(event: Event) {
        this.stockUserInput = (event.target as HTMLInputElement).value;
        if (this.stockUserInput.trim() !== '') {
            this.stockInputValid = true;
        } else {
            this.stockInputValid = false;
        }
    }

    async fetchStockPrice(title: string) {
        const response = await fetch(`http://localhost:3000/stocks?title=${title}`)
        return await response.json();
    }

    async onFetchStockPrice(event: Event) {
        console.log('stockUserInput', this.stockUserInput);
        event.preventDefault();
        this.error = null;
        try {
            const data = await this.fetchStockPrice(this.stockUserInput)
            console.log(data);

            // "this" refers to the context of the caller, in that case the context of the form
            this.stocks = data;
        } catch (error) {
            this.error = error.message;
            console.error(error);
        }
    }

    componentWillLoad() {
        if (this.stockTitle) {
            this.fetchStockPrice(this.stockTitle).then(data => this.stocks = data);
        }
    }

    render() {
        return [
            <form onSubmit={(event) => this.onFetchStockPrice(event)}>
                <input type="text" id="stock-symbol" ref={el => this.stockInput = el} value={this.stockUserInput} onInput={(e) => this.onUserInput(e)} />
                <button type="submit" disabled={!this.stockInputValid}>Fetch</button>
            </form>,
            <div>
                <p>Stocks quantity: {this.stocks.length}</p>
                {this.error && <p>Invalid stock</p>}
                {!this.error && this.stocks.map(stock => (
                    <div id={stock.id}>
                        <h3>{stock.title}</h3>
                        <p>Value: U$ {stock.value}</p>
                    </div>
                ))}
            </div>
        ]
    }
}