import { gql } from "@apollo/client";

class GraphQLUtils {
    static stateTxn (apolloClientConnector, message, payload) {
        let options = {
            mutation: gql`
                mutation stateTxn($message: InputSignedStateTxn!, $payload: InputPayload) {
                    stateTxn(message: $message, payload: $payload){
                        txnHash
                    }        
                }
            `,
            variables: { message, payload }
        }
        return apolloClientConnector.mutate(options).then((res) => {
            console.log("[LOG] Response received from GPRM")
            if (!res.data) {
                throw new Error(res.errors[0].message)
            }
            return res.data.stateTxn
        })
    }
}
export default GraphQLUtils;