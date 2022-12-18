import React, { useState } from "react";
import cn from "classnames";
import { useNavigate, useParams } from "react-router-dom";

import { IUser } from "utils/interface";
import { useAppDispatch, useAppSelector, useWindowSize } from "utils/hooks";
import { CardContact } from "components/contacts";
import { Search } from "components/layouts";
import { getContacts, getMenuContact, getTabIndexThree } from "store/select";
import {
  actionMenuContact,
  actionClearMessages,
  actionClearRecipient,
  actionAddRecipient,
  actionAddTabIndexFirst,
  actionAddTabIndexThree,
  actionAddTabIndexSixth,
  actionMenuMain,
} from "store/slice";
import { BackIcon } from "assets";

import { ContactsProps } from "./Contacts.props";
import styles from "./Contacts.module.css";

export const Contacts = ({
  className,
  searchContact,
  ...props
}: ContactsProps): JSX.Element => {
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const windowSize = useWindowSize();
  //store
  const contacts: IUser[] | undefined = useAppSelector(getContacts);
  const contact: boolean = useAppSelector(getMenuContact);
  const tabIndexThree = useAppSelector(getTabIndexThree);

  const [valueContact, setValueContact] = useState<string>("");
  const [swiper, setSwiper] = useState<boolean>(false);
  //processing the transition to the chat with the user, if the users are not equal then it reloads the messages, if they are equal, then it clears the tabs
  const handleFocus = (contact: IUser): void => {
    if (String(contact.username) !== String(username)) {
      dispatch(actionMenuContact(false));
      dispatch(actionClearMessages());
      dispatch(actionClearRecipient());
      dispatch(actionAddRecipient(contact));
      dispatch(actionAddTabIndexFirst(0));
      dispatch(actionAddTabIndexThree(-1));
      dispatch(actionAddTabIndexSixth(0));
      navigate(`${contact?.username}`);
    }
    if (String(contact.username) === String(username)) {
      dispatch(actionMenuContact(false));
      dispatch(actionAddTabIndexFirst(0));
      dispatch(actionAddTabIndexThree(-1));
      dispatch(actionAddTabIndexSixth(0));
    }
    if (windowSize[0] < 1000) {
      dispatch(actionMenuMain(false));
      dispatch(actionAddTabIndexFirst(-1));
    }
  };

  const handleClick = (): void => {
    dispatch(actionMenuContact(false));
    dispatch(actionAddTabIndexThree(-1));
    dispatch(actionAddTabIndexFirst(0));
    dispatch(actionAddTabIndexSixth(0));
    if (windowSize[0] < 1000) {
      dispatch(actionAddTabIndexSixth(-1));
    }
  };

  return (
    <section
      className={cn(className, styles.contactsWrapper, {
        [styles.contactWrapperOpen]: contact,
      })}
      {...props}
    >
      <div className={styles.contactSearch}>
        <button
          tabIndex={tabIndexThree}
          className={styles.back}
          onClick={handleClick}
        >
          <BackIcon className={styles.backIcon} />
        </button>
        <Search
          value={valueContact}
          setValue={setValueContact}
          ref={searchContact}
          tabIndex={tabIndexThree}
        />
      </div>
      <section
        className={cn(styles.contactsList, {
          [styles.swiper]: swiper,
        })}
        onMouseLeave={() => setSwiper(false)}
        onMouseOut={() => setSwiper(true)}
      >
        <ul>
          {contacts &&
            contacts
              .map((contact: IUser) => (
                <CardContact
                  contact={contact}
                  key={contact.id}
                  setValue={setValueContact}
                  handleFocus={handleFocus}
                  tabIndex={tabIndexThree}
                />
              ))
              .filter((val) => {
                if (valueContact.replaceAll(" ", "") === "") {
                  return true;
                }
                if (valueContact.replaceAll(" ", "") !== "") {
                  const contact: IUser = val?.props?.contact;
                  if (
                    contact.name
                      .toLowerCase()
                      .includes(valueContact.toLowerCase()) ||
                    contact.surname
                      .toLowerCase()
                      .includes(valueContact.toLowerCase())
                  ) {
                    return true;
                  }
                }
                return false;
              })}
        </ul>
      </section>
    </section>
  );
};
