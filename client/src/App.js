import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import PageRender from './customRouter/PageRender';
import Home from './pages/home';
import Login from './pages/login';
import { refreshToken } from './redux/reducer/authSlice';
import { getPosts, getPostsExplore } from './redux/reducer/postSlice';
import { suggestionsUser } from './redux/reducer/userSlice';
import io from 'socket.io-client';
import { getSocket } from './redux/reducer/socketSlice';
import SocketClient from './SocketClient';
import { getNotifies } from './redux/reducer/notifySlice';
import { getConversation } from './redux/reducer/messageSlice';
import BottomAlert from './components/BottomAlert';
import CallModal from './components/CallModal';
import Peer from 'peerjs';
import { setPeer } from './redux/reducer/peerSlice';
import Suggestions from './pages/suggestions';

function App() {
    const { auth, alert, call } = useSelector((state) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(refreshToken(''));
        const socket = io();
        dispatch(getSocket(socket));
        return () => {
            socket.close();
        };
    }, [dispatch]);

    useEffect(() => {
        if (auth.token) {
            dispatch(getPosts());
            dispatch(getNotifies());
            dispatch(getPostsExplore());
            dispatch(getConversation());
        }
    }, [auth.token, dispatch]);

    useEffect(() => {
        if (auth.token) {
            dispatch(suggestionsUser());
        }
    }, [auth.token, dispatch]);

    useEffect(() => {
        if (auth.token) {
            const newPeer = new Peer(undefined, {
                host: '/',
                path: '/',
                port: 443,
                secure: true,
            });
            dispatch(setPeer(newPeer));
        }
    }, [dispatch, auth.token]);

    return (
        <Router>
            <div className="App">
                {alert.bottomAlert && <BottomAlert />}

                {call.data && <CallModal />}

                {auth.token && <Header />}
                {auth.token && <SocketClient />}

                <Route
                    exact
                    path="/"
                    component={
                        auth.user.following <= 0
                            ? Suggestions
                            : auth.token
                            ? Home
                            : Login
                    }
                />
                <Route exact path="/:page/:action" component={PageRender} />
                <Route exact path="/:page" component={PageRender} />
            </div>
        </Router>
    );
}

export default App;
