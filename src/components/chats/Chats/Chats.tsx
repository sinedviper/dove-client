import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import { v4 as uuidv4 } from "uuid";

import { IChat, IUser } from "utils/interface";
import {
  useAppDispatch,
  useAppSelector,
  useAuthorizationSearch,
  useError,
  useWindowSize,
} from "utils/hooks";
import { colorCard } from "utils/helpers";
import { getUsersSearch } from "resolvers/user";
import { LoadingIcon } from "assets";
import { SERVER_LINK } from "utils/constants";
import { CardChat, ChatsHeader } from "components/chats";
import { CardContact } from "components/contacts";
import {
  actionAddRecipient,
  actionAddTabIndexFirst,
  actionAddTabIndexSecond,
  actionAddTabIndexSixth,
  actionClearMessages,
  actionClearRecipient,
  actionMenuMain,
  getChat,
  getContacts,
  getFetch,
  getTabIndexFirst,
  getTabIndexSecond,
  getUser,
} from "store";

import { ChatsProps } from "./Chats.props";
import styles from "./Chats.module.css";

export const Chats = ({
  searchContact,
  className,
  ...props
}: ChatsProps): JSX.Element => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useError();
  const windowSize = useWindowSize();
  const autorizationSearch = useAuthorizationSearch();
  //store
  const fetch: boolean = useAppSelector(getFetch);
  const user: IUser | undefined = useAppSelector(getUser);
  const contacts: IUser[] | undefined = useAppSelector(getContacts);
  const chats: IChat[] | undefined = useAppSelector(getChat);
  const tabIndexFirst: number = useAppSelector(getTabIndexFirst);
  const tabIndexSecond: number = useAppSelector(getTabIndexSecond);

  const [valueAll, setValueAll] = useState<string>("");

  const { data: dataSearch } = useQuery(getUsersSearch, {
    variables: {
      input: { username: String(valueAll) },
    },
    onError(errorData) {
      error(errorData.message);
    },
    pollInterval: 500,
  });
  //store
  let searchUsers: IUser[] | undefined = dataSearch
    ? autorizationSearch({
        data: dataSearch?.searchUsers,
      })
    : undefined;

  const [click, setClick] = useState<boolean>(false);
  const [swiper, setSwiper] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<boolean>(false);
  //function to process the request when clicking on the chat
  const handleFocus = async (contact: IUser) => {
    if (String(contact.username) !== String(username)) {
      setValueAll("");
      setSearchUser(false);
      dispatch(actionClearMessages());
      dispatch(actionClearRecipient());
      dispatch(actionAddRecipient(contact));
      dispatch(actionAddTabIndexFirst(0));
      dispatch(actionAddTabIndexSixth(0));
      dispatch(actionAddTabIndexSecond(-1));
      navigate(`${contact?.username}`);
    }
    if (String(contact.username) === String(username)) {
      setValueAll("");
      setSearchUser(false);
      dispatch(actionAddTabIndexFirst(0));
      dispatch(actionAddTabIndexSixth(0));
      dispatch(actionAddTabIndexSecond(-1));
    }
    if (windowSize[0] < 1000) {
      dispatch(actionMenuMain(false));
      dispatch(actionAddTabIndexFirst(-1));
      dispatch(actionAddTabIndexSixth(0));
    }
  };

  return (
    <section
      className={className}
      onMouseOut={() => setSwiper(true)}
      {...props}
    >
      <ChatsHeader
        searchContact={searchContact}
        setSwiper={setSwiper}
        setSearchUser={setSearchUser}
        searchUser={searchUser}
        valueAll={valueAll}
        setValueAll={setValueAll}
      />
      <section
        className={cn(styles.searchWrapperUsers, {
          [styles.searchWrapperUsersOn]: searchUser === true,
        })}
      >
        {contacts?.length !== 0 && valueAll.replaceAll(" ", "") === "" && (
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
                    onTouchStart={() => {
                      setClick(true);
                    }}
                    onMouseDown={() => setClick(true)}
                    onMouseUp={() => {
                      setClick(false);
                      handleFocus(contact);
                    }}
                    onTouchEnd={() => {
                      setClick(false);
                      handleFocus(contact);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleFocus(contact);
                        if (windowSize[0] < 1000) {
                          dispatch(actionAddTabIndexFirst(-1));
                          dispatch(actionAddTabIndexSixth(0));
                        }
                      }
                    }}
                    tabIndex={tabIndexSecond}
                  >
                    <div
                      className={styles.contactPhoto}
                      style={{
                        background: contact.file
                          ? ""
                          : `linear-gradient(${color1}, ${color2})`,
                      }}
                    >
                      {contact.file ? (
                        <img
                          className={styles.contactImage}
                          src={`${SERVER_LINK}/images/${contact.file}`}
                          alt='contact img'
                        />
                      ) : (
                        <span>{contact.name.toUpperCase()[0]}</span>
                      )}
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
            {searchUsers.map((user) => (
              <CardContact
                key={user.id}
                contact={user}
                handleFocus={() => handleFocus(user)}
                setValue={setValueAll}
                search={true}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFocus(user);
                  }
                }}
                tabIndex={tabIndexSecond}
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
          {fetch && (
            <li className={styles.fetchError} tabIndex={-1}>
              <LoadingIcon className={styles.fetchErrorLoading} />
              <p>The server is not responding</p>
            </li>
          )}
          {chats &&
            chats
              .filter((chat: IChat) => chat.user.username === user?.username)
              .map((chat: IChat) => (
                <CardChat chat={chat} key={uuidv4()} tabIndex={tabIndexFirst} />
              ))}
          {chats &&
            chats
              .filter((chat: IChat) => chat.user.username !== user?.username)
              .map((chat: IChat) => (
                <CardChat chat={chat} key={uuidv4()} tabIndex={tabIndexFirst} />
              ))}
        </ul>
      </section>
    </section>
  );
};
