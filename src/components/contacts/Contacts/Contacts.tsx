import React, { useState } from "react";
import cn from "classnames";

import { IUser } from "utils/interface";
import { useAppDispatch, useAppSelector } from "utils/hooks";
import { CardContact } from "components/contacts";
import { Search } from "components/layouts";
import {
  actionAddRecipient,
  actionClearMessages,
  actionClearRecipient,
  actionMenuContact,
  getContacts,
  getMenuContact,
} from "store";
import { BackIcon } from "assets";

import { ContactsProps } from "./Contacts.props";
import styles from "./Contacts.module.css";
import { useNavigate } from "react-router-dom";

export const Contacts = ({
  className,
  searchContact,
  ...props
}: ContactsProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [valueContact, setValueContact] = useState<string>("");
  const [swiper, setSwiper] = useState<boolean>(false);

  const contacts: IUser[] | undefined = useAppSelector(getContacts);
  const contact: boolean = useAppSelector(getMenuContact);

  const handleFocus = (contact: IUser) => {
    dispatch(actionMenuContact(false));
    dispatch(actionClearMessages());
    dispatch(actionClearRecipient());
    dispatch(actionAddRecipient(contact));
    navigate(`${contact?.username}`);
  };

  return (
    <section
      className={cn(className, styles.contactsWrapper, {
        [styles.contactWrapperOpen]: contact === true,
      })}
      {...props}
    >
      <div className={styles.contactSearch}>
        <BackIcon
          className={styles.back}
          onClick={() => dispatch(actionMenuContact(false))}
        />
        <Search
          value={valueContact}
          setValue={setValueContact}
          ref={searchContact}
        />
      </div>
      <section
        className={cn(styles.contactsList, {
          [styles.swiper]: swiper === true,
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
                  handleFocus={() => handleFocus(contact)}
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
