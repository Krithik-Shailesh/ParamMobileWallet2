import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
    concat,
} from "@apollo/client";
import Config from "../../../../config.json";
import GraphUtils from "./graph-utils";
import TxnType from "../txn";
import StateMachineWrapper from "./wrapper";

class GPRM {
    constructor() { }
    setParamID(paramID) {
        this.paramID = paramID;
    }
    connect = (uri = "140.238.182.66") => {
        if (this.apolloClientConnector) {
            return; //Promise.resolve();
        }
        uri = Config["graph-utils"]["url"]
        const cache = new InMemoryCache();
        const httpLink = new HttpLink({
            uri: `${Config["graph-utils"]["protocol"]}://${uri}:${Config["graph-utils"]["http-port"]}/graphql`,
        });

        // const wsLink = new WebSocketLink({
        //     uri: `${Config["graph-utils"].websocket}://${uri}:${Config["graph-utils"]["ws-port"]}/graphql`,
        //     options: {
        //         reconnect: true
        //     }
        // });

        const authMiddleware = new ApolloLink((operation, forward) => {
            // add the authorization to the headers
            operation.setContext({
                headers: {
                    Authorization: this.paramID,
                },
            });
            return forward(operation);
        });

        // const splitLink = split(
        //     ({ query }) => {
        //         const definition = getMainDefinition(query);
        //         return (
        //             definition.kind === 'OperationDefinition' &&
        //             definition.operation === 'subscription'
        //         );
        //     },
        //     wsLink,
        //     httpLink,
        // );

        this.apolloClientConnector = new ApolloClient({
            cache: cache,
            link: concat(authMiddleware, httpLink),
            // Provide some optional constructor fields
            name: "react-web-client",
            version: "1.3",
            queryDeduplication: false,
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: "cache-and-network",
                },
                query: {
                    fetchPolicy: "network-only",
                    errorPolicy: "all",
                },
                mutate: {
                    errorPolicy: "all",
                },
            },
        });
    };

    createSM(
        from,
        txnType,
        stateTo,
        stateMachine,
        docID,
        jsonLD,
        payloadType,
        subscribers = {},
        roles = {},
        props = {},
        exchangeDetails
    ) {
        let { message, payload } = StateMachineWrapper.parseArguments(
            from,
            txnType,
            stateTo,
            stateMachine,
            docID,
            jsonLD,
            payloadType ? payloadType : TxnType.PUBLIC,
            subscribers,
            roles,
            { Mode: payloadType ? payloadType : TxnType.PUBLIC },
            exchangeDetails
        );
        return this.stateTxn(message, payload);
    }

    updateSM(
        from,
        txnType,
        stateTo,
        stateMachine,
        docID,
        jsonLD,
        payloadType,
        subscribers = {},
        roles = {},
        props = {},
        exchangeDetails
    ) {
        let { message, payload } = StateMachineWrapper.parseArguments(
            from,
            txnType,
            stateTo,
            stateMachine,
            docID,
            jsonLD,
            payloadType ? payloadType : TxnType.PUBLIC,
            subscribers,
            roles,
            { Mode: payloadType ? payloadType : TxnType.PUBLIC },
            exchangeDetails
        );
        return this.stateTxn(message, payload);
    }

    stateTxn(message, payload, count) {
        let online = window.navigator.onLine;
        if (!online) {
            return Promise.reject({ status: "offline" });
        }

        return GraphUtils.stateTxn(
            this.apolloClientConnector,
            message,
            payload
        ).catch((err) => {
            // if (count < Config.retryCount) {
            //   return this.stateTxn(message, payload, count + 1);
            // }
            return Promise.reject(err);
        });
    }

    disconnect() {
        this.paramID = undefined;
        this.apolloClientConnector = undefined;
    }
}

export default GPRM;
