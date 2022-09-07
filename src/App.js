import React, {useState, useEffect} from "react";
import './App.css';
import axios from 'axios';
import Item from "./item";

const APIKEY = "1ucdLevrR0ljONFr0mhGnlSZ5dIUcbCU";

function App() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const searchAPI = () => {
        if (query == '') {
            alert('Lütfen kelime giriniz. ');
            return;
        }
        setLoading(true);
        axios.get(`https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${encodeURIComponent(query)}&api-key=${APIKEY}&offset=${currentPage}`).then((res) => {
            if (res.data.status == 'OK') {
                setData(res.data.results ==  null ? [] : res.data.results);
                setHasMore(res.data.has_more);
                setLoading(false);
            } else {
                alert('bir hata oluştu');
            }
        })
            .catch((error) => {
                console.log(error);
            })

    };

    useEffect(() => {
        if (query != '') {
            setData([]);
            searchAPI()
        }
    }, [currentPage])
    return (<div>
        <div className={'search-area'}>
            <div>
                <input className={'input'} type="text" onChange={(event) => setQuery(event.target.value)}
                       value={query}/>
                <button disabled={loading} onClick={searchAPI}>Search</button>
            </div>
            <div>{loading && <span>Yükleniyor...</span>}</div>
        </div>
        {!loading && data.length == 0 && <div style={{display:"flex", justifyContent:"center",alignItems:"center"}}><span>Veri Bulunamadı.</span> </div>}

        <div className={'item-area'}>
            {data.length > 0 && data.map((item) => <Item item={item}/>)}
        </div>

        <div className={"pagination"}>
            {hasMore && currentPage > 0 &&
                <div>
                    <button onClick={() => setCurrentPage(currentPage - 1)}>Geri</button>
                </div>
            }
            {hasMore &&
                <div>
                    <button onClick={() => setCurrentPage(currentPage + 1)}>İleri</button>
                </div>
            }
        </div>

    </div>);
}

export default App;
