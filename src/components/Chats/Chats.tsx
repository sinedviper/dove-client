/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import cn from "classnames";
import { useLazyQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import { ChatsProps } from "./Chats.props";
import { CardChat, CardContact, ChatsHeader } from "components";
import { IChat, IUser } from "interface";
import { getUsersSearch } from "mutation";
import { checkAuthorizationSearch, colorCard } from "helpers";
import {
  actionAddReceipt,
  actionClearMessages,
  actionClearReceipt,
  getContacts,
  getUser,
} from "store";
import { useAppDispatch, useAppSelector, useDebounce } from "hooks";

import styles from "./Chats.module.css";
import { useTheme } from "context";

export const Chats = ({
  chats,
  searchContact,
  setContact,
  setSettings,
  className,
  ...props
}: ChatsProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const themeChange = useTheme();
  const { username } = useParams();

  const user: IUser | null = useAppSelector(getUser);
  const contacts: IUser[] | null = useAppSelector(getContacts);

  const [click, setClick] = useState<boolean>(false);
  const [swiper, setSwiper] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<boolean>(false);
  const [valueAll, setValueAll] = useState<string>("");
  const [length, setLength] = useState<number>(0);

  const [querySearch, { data: dataSearch }] = useLazyQuery(getUsersSearch);

  let searchUsers: IUser[] | undefined = dataSearch
    ? checkAuthorizationSearch({
        dispatch,
        navigate,
        data: dataSearch?.searchUsers,
        themeChange,
      })
    : undefined;

  const handleFocus = async (contact: IUser) => {
    setSearchUser(false);
    dispatch(actionClearMessages());
    dispatch(actionClearReceipt());
    dispatch(actionAddReceipt(contact));
    navigate(`${contact?.username}`);
  };

  const debouncedCheck = useDebounce(() => {
    querySearch({
      variables: {
        input: { userId: Number(user?.id), username: String(valueAll) },
      },
    });
  }, 200);

  useEffect(() => {
    if (length !== valueAll.replaceAll(" ", "").length) {
      debouncedCheck();
      setLength(valueAll.replaceAll(" ", "").length);
    }
  }, [valueAll]);

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
        {valueAll.replaceAll(" ", "") === "" && (
          <div
            className={cn(styles.contactListWrapper, {
              [styles.contactListWrapperOn]:
                valueAll.replaceAll(" ", "") !== "",
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
        )}
        {searchUsers && searchUsers.length !== 0 && (
          <div className={styles.searchWrapper}>
            <p>Global users</p>
            {searchUsers.map((obj) => (
              <CardContact
                key={obj.id}
                contact={obj}
                setContact={setSearchUser}
                setValue={setValueAll}
                search={true}
              />
            ))}
          </div>
        )}
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
