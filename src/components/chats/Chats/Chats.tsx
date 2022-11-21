import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";

import { useTheme } from "utils/context";
import { IChat, IUser } from "utils/interface";
import { useAppDispatch, useAppSelector, useDebounce } from "utils/hooks";
import { checkAuthorizationSearch, colorCard } from "utils/helpers";
import { getUsersSearch } from "resolvers/user";
import { CardChat, ChatsHeader } from "components/chats";
import { CardContact } from "components/contacts";
import {
  actionAddError,
  actionAddRecipient,
  actionClearMessages,
  actionClearRecipient,
  getChat,
  getContacts,
  getUser,
} from "store";

import { ChatsProps } from "./Chats.props";
import styles from "./Chats.module.css";

export const Chats = ({
  searchContact,
  className,
  ...props
}: ChatsProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const themeChange = useTheme();
  const { username } = useParams();

  const user: IUser | undefined = useAppSelector(getUser);
  const contacts: IUser[] | undefined = useAppSelector(getContacts);
  const chats: IChat[] | undefined = useAppSelector(getChat);

  const [querySearch, { data: dataSearch, error: errorQueryUser }] =
    useLazyQuery(getUsersSearch);

  let searchUsers: IUser[] | undefined = dataSearch
    ? checkAuthorizationSearch({
        dispatch,
        navigate,
        data: dataSearch?.searchUsers,
        themeChange,
      })
    : undefined;

  const [click, setClick] = useState<boolean>(false);
  const [swiper, setSwiper] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<boolean>(false);
  const [valueAll, setValueAll] = useState<string>("");
  const [length, setLength] = useState<number>(0);

  const handleFocus = async (contact: IUser) => {
    setSearchUser(false);
    dispatch(actionClearMessages());
    dispatch(actionClearRecipient());
    dispatch(actionAddRecipient(contact));
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
    if (errorQueryUser) dispatch(actionAddError(errorQueryUser.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueAll, length, errorQueryUser]);

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
            {searchUsers.map((user) => (
              <CardContact
                key={user.id}
                contact={user}
                handleFocus={() => handleFocus(user)}
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
