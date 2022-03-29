import React from "react";
import AccountDetails from "../AccountDetails/AccountDetails";

const MyAccount = ({accountAddress, accountBalance}) => {
    return (
        <AccountDetails
            accountAddress={accountAddress}
            accountBalance={accountBalance}
        />
    );
};

export default MyAccount;
