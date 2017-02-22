

create table account(  
    id bigserial primary key,
    name text not null,
    role text not null,
    email text not null,
    password text not null,
    created timestamp without time zone not null,
    modified timestamp without time zone not null
);

create table post(
    id bigserial primary key,
    slug text not null,
    created timestamp without time zone not null,
    modified timestamp without time zone not null
);

create table post_version(
    id bigserial primary key,
    latest boolean not null,
    post bigint references post on update cascade,
    author bigint references account on update cascade,
    body text,
    created timestamp without time zone not null,
    modified timestamp without time zone not null
);

create table session(
    id bigserial primary key,
    valid boolean not null,
    account bigint references account on update cascade,
    host text,
    ip inet,
    user_agent text,
    created timestamp without time zone not null,
    modified timestamp without time zone not null,
    expires timestamp without time zone
);

