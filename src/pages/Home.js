import React, { useEffect, useState } from 'react'
import { Container, Card, CardGroup, Form } from 'react-bootstrap'

export default function Home() {
    const [lastTradePrice, setLastTradePrice] = useState('')
    const [price24h, setPrice24h] = useState('')
    const [holdingBTC, setHoldingBTC] = useState(null)
    const [holdingUSD, setHoldingUSD] = useState(null)

    function fetchPrice() {
        fetch('https://api.blockchain.com/v3/exchange/tickers/BTC-USD', {
            headers: {
                "X-API-Token": 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkFQSSJ9.eyJhdWQiOiJtZXJjdXJ5IiwidWlkIjoiYzA4ZDMxMjMtYTBmZC00NDg3LTkxYWUtNzU0NzRhMTU0YWE5IiwiaXNzIjoiYmxvY2tjaGFpbiIsInJkbyI6dHJ1ZSwiaWF0IjoxNjA4OTY3Njg4LCJqdGkiOiIyODViMjkyZi1jNDhjLTQyN2EtYjE1OS1lN2EwNGY2Nzg0MmUiLCJzZXEiOjE4MTI3NjAsIndkbCI6ZmFsc2V9.H0KInfw/3gJ027frM08FNSB9+/hoKwgPFAXoFCloWiI2M/Ha8vynZAS7deamPvSskxwg9WUIIb1WchSQqIdqwGs='
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setLastTradePrice(res.last_trade_price)
                setPrice24h(res.price_24h)
                // setVolume24h(res.volume_24h)
            })
    }

    function currencyTransform(string) {
        return Number(string).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }

    useEffect(() => {
        fetchPrice()
        setInterval(() => fetchPrice(), 10000)
    }, [])

    useEffect(() => {
        setHoldingUSD(holdingBTC * Number(lastTradePrice))
    },[holdingBTC, lastTradePrice])

    return (
        <Container>
            <h1 className="text-center my-5">BTC-USD Price Tracker</h1>
            <CardGroup>
                <Card>
                    <Card.Body>
                        <Card.Title>BTC-USD (24H)</Card.Title>
                        {price24h ? <Card.Text>{currencyTransform(price24h)}</Card.Text> : <Card.Text>Data Unavailable</Card.Text>}
                    </Card.Body>
                    <Card.Footer>
                        <small className="">Updates every 10 seconds</small>
                    </Card.Footer>
                </Card>
                <Card>
                    <Card.Body>
                        <Card.Title>BTC-USD (Last Trade Price)</Card.Title>
                        {lastTradePrice ? <Card.Text>{currencyTransform(lastTradePrice)}</Card.Text> : <Card.Text>Data Unavailable</Card.Text>}
                    </Card.Body>
                    <Card.Footer>
                        <small className="">Updates every 10 seconds</small>
                    </Card.Footer>
                </Card>
            </CardGroup>

            <h2 className="text-center mt-5 mb-4">Check your holdings</h2>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>BTC-USD</Form.Label>
                    <Form.Control type="number" placeholder="Enter your BTC Holding" onChange={(e) => setHoldingBTC(e.target.value)} />
                    <Form.Text className="">
                        Calculated based on last trading price
                    </Form.Text>
                </Form.Group>
                {holdingUSD ? <h2>{currencyTransform(holdingUSD)}</h2> : null}
            </Form>
        </Container>
    )
}