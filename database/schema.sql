

create table account(  
    id text primary key,
    name text not null,
    role text not null,
    email text not null,
    password text not null,
    created timestamp with time zone not null,
    modified timestamp with time zone not null
);

create table post(
    id text primary key,
    slug text not null,
    created timestamp with time zone not null,
    modified timestamp with time zone not null
);

create table post_version(
    id text primary key,
    latest boolean not null,
    post text references post on update cascade,
    author text references account on update cascade,
    body text,
    created timestamp with time zone not null,
    modified timestamp with time zone not null
);

create table session(
    id text primary key,
    valid boolean not null,
    account text references account on update cascade,
    host text,
    ip inet,
    user_agent text,
    created timestamp with time zone not null,
    modified timestamp with time zone not null,
    lastactive timestamp with time zone not null,
    expires timestamp with time zone
);

