import { Element, h, State } from "@stencil/core";
import { Component } from "@stencil/core";

@Component({
    tag: 'stock-price',
    styleUrl: './stock-price.css',
    shadow: true
})
export class StockPrice {
    @Element() el: HTMLElement;
    @State() stocks = [];
    stockInput: HTMLInputElement;

    onFetchStockPrice(event: Event) {
        console.log('stockInputValue', this.stockInput.value);
        event.preventDefault();
        fetch('http://localhost:3000/stocks').then((response) => {
            response.json().then(data => {
                console.log(data);

                // This refers to the context of the caller, in that case the context of the form
                this.stocks = data;
            })
        }).catch(error => {
            console.error(error);
        })
    }

    render() {
        return [
            <form onSubmit={(event) => this.onFetchStockPrice(event)}>
                <input type="text" id="stock-symbol" ref={el => this.stockInput = el} />
                <button>Fetch</button>
            </form>,
            <div>
                <p>Stocks quantity: {this.stocks.length}</p>
                {this.stocks.map(stock => (
                    <div id={stock.id}>
                        <h3>{stock.title}</h3>
                        <p>Value: U$ {stock.author}</p>
                    </div>
                ))}
            </div>
        ]
    }
}