import React, { useState } from "react";
import cn from "classnames";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import { ChatsProps } from "./Chats.props";
import { CardChat, ChatsHeader } from "components";
import { IChat, IUser } from "interface";
import { addChat, getUsersSearch } from "mutation";
import { colorCard } from "helpers";
import { getContacts, getUser } from "store";
import { useAppSelector } from "hooks";

import styles from "./Chats.module.css";

export const Chats = ({
  chats,
  searchContact,
  setContact,
  setSettings,
  className,
  ...props
}: ChatsProps): JSX.Element => {
  const navigate = useNavigate();
  const { username } = useParams();

  const user: IUser | null = useAppSelector(getUser);
  const contacts: IUser[] | null = useAppSelector(getContacts);

  const [mutationFunction] = useMutation(addChat);

  const [click, setClick] = useState<boolean>(false);
  const [swiper, setSwiper] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<boolean>(false);
  const [valueAll, setValueAll] = useState<string>("");

  const [querySearch, { data: dataSearch }] = useLazyQuery(getUsersSearch);

  const handleFocus = async (contact: IUser) => {
    setSearchUser(false);
    await mutationFunction({
      variables: {
        chat: { sender: Number(user?.id), recipient: Number(contact.id) },
      },
    });
    navigate(`${contact.username}`);
  };

  if (valueAll.replaceAll(" ", "") !== "") {
    querySearch({
      variables: { userId: Number(user?.id), username: String(valueAll) },
    });
  }

  return (
    <section
      className={className}
      onMouseOut={() => setSwiper(true)}
      {...props}
    >
      <ChatsHeader
        searchContact={searchContact}
        setSwiper={setSwiper}
        setContact={setContact}
        setSearchUser={setSearchUser}
        setSettings={setSettings}
        searchUser={searchUser}
        valueAll={valueAll}
        setValueAll={setValueAll}
      />
      <section
        className={cn(styles.searchWrapperUsers, {
          [styles.searchWrapperUsersOn]: searchUser === true,
        })}
      >
        <div
          className={cn(styles.contactListWrapper, {
            [styles.contactListWrapperOn]: valueAll.replaceAll(" ", "") !== "",
          })}
        >
          {contacts &&
            contacts.map((contact) => {
              const { color1, color2 } = colorCard(
                contact.name.toUpperCase()[0]
              );
              return (
                <div
                  key={contact.id}
                  className={cn(styles.contactWrapper, {
                    [styles.contactWrapperOn]: username === contact.username,
                    [styles.contactWrapperClick]: click === true,
                  })}
                  onClick={() => handleFocus(contact)}
                  onMouseDown={() => setClick(true)}
                  onMouseUp={() => setClick(false)}
                >
                  <div
                    className={styles.contactPhoto}
                    style={{
                      background: `linear-gradient(${color1}, ${color2})`,
                    }}
                  >
                    <span>{contact.name.toUpperCase()[0]}</span>
                  </div>
                  <p>{contact.name}</p>
                </div>
              );
            })}
        </div>
        <div>
          {dataSearch &&
            dataSearch.searchUsers.map((obj) => <div>{obj.id}</div>)}
        </div>
      </section>
      <section
        className={cn(styles.contactsList, {
          [styles.swiper]: swiper === true,
        })}
      >
        <ul>
          {chats &&
            chats.map((contact: IChat) => (
              <CardChat contact={contact} key={contact.id} />
            ))}
        </ul>
      </section>
    </section>
  );
};
