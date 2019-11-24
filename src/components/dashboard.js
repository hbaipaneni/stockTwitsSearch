import React, { useState } from 'react';
import { useSearchArtist } from './search';

const TweetBody = ({ body }) => {
    const limit = 150;
    const [expand, setExpand] = useState(body.length < limit ? true : false);
    return expand ? (<div className="tweetBody">{body}</div>) :
        <div className="tweetBody">
            {body.substring(0, limit)}...
            <span className="readMore" onClick={() => setExpand(true)}> Read More</span>
        </div>
}
const Dashboard = () => {

    const { inputText, setInputText, search } = useSearchArtist();
    return (
        <div className="row">
            <div className="col-12">
                <input value={inputText} onChange={e => setInputText(e.target.value)} type="text" className="form-control"
                    placeholder="Search" aria-label="Search" />
                <div>
                    {search.loading && <div>...</div>}
                    {search.error && <div>Error: {search.error.message}</div>}
                </div>
            </div>

            {search.result && <>
                {search.result.map((allTweets, ind) => (
                     <h3>{!!ind && ','} {allTweets.symbol.symbol} - {allTweets.messages.length}</h3>
                ))}
                {search.result.map(allTweets => (
                    <div className="col-12" key={allTweets.symbol.id}>
                        {/* <h3>{allTweets.symbol.symbol} - {allTweets.messages.length}</h3> */}
                        {
                            allTweets.messages.map((tweet) => (

                                <div className="card" key={tweet.id}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-3 userImgWrap">
                                                <img src={tweet.user.avatar_url} className="card-img-top" alt="..." target="_blank" />
                                            </div>
                                            <div className="col-9">
                                                <h5 className="card-title">{tweet.user.name}</h5>
                                                <TweetBody body={tweet.body} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ))
                    }
                </>}
        </div>
    );
}

export default Dashboard;