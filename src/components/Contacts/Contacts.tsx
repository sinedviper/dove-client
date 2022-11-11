import React, { useState } from "react";
import cn from "classnames";

import { ContactsProps } from "./Contacts.props";
import { BackIcon } from "assets";
import { CardContact, Search } from "components";
import { IUser } from "interface";

import styles from "./Contacts.module.css";

export const Contacts = ({
  className,
  searchContact,
  contact,
  setContact,
  contacts,
  ...props
}: ContactsProps): JSX.Element => {
  const [valueContact, setValueContact] = useState<string>("");
  const [swiper, setSwiper] = useState<boolean>(false);

  return (
    <section
      className={cn(className, styles.contactsWrapper, {
        [styles.contactWrapperOpen]: contact === true,
      })}
      {...props}
    >
      <div className={styles.contactSearch}>
        <BackIcon className={styles.back} onClick={() => setContact(false)} />
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
                  setContact={setContact}
                />
              ))
              // eslint-disable-next-line array-callback-return
              .filter((val) => {
                if (valueContact.replaceAll(" ", "") === "") {
                  return true;
                } else if (valueContact !== "") {
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
              })}
        </ul>
      </section>
    </section>
  );
};
