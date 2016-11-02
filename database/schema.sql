
-- ----------------------
--         Tables
-- ----------------------

-- Accounts
-----------

drop trigger update_account_modified on account cascade;
drop sequence account_id_sequence cascade;
drop table account cascade;

create sequence account_id_sequence;
create table account(  
    id int default nextval('account_id_sequence') primary key,
    name text not null,
    email text not null,
    password text not null,
    created timestamp with time zone default now(),
    modified timestamp with time zone default now()
);

alter sequence account_id_sequence owned by account.id;
create trigger update_account_modified before update on account for each row execute procedure update_modified_column();


-- Posts
--------

drop trigger update_post_modified on post cascade;
drop sequence post_id_sequence cascade;
drop table post cascade;

create sequence post_id_sequence;

create table post(
    id int default nextval('post_id_sequence') primary key,
    slug text not null,
    created timestamp with time zone default now(),
    modified timestamp with time zone default now()
);

alter sequence post_id_sequence owned by post.id;

create trigger update_post_modified before update on post for each row execute procedure update_modified_column();


-- Post Versions
----------------

drop trigger update_post_version_modified on post_version cascade;
drop sequence post_version_id_sequence cascade;
drop table post_version cascade;

create sequence post_version_id_sequence;

create table post_version(
    id int default nextval('post_id_sequence') primary key,
    head boolean not null,
    post int references post on update cascade,
    author int references account on update cascade,
    body text,
    created timestamp with time zone default now(),
    modified timestamp with time zone default now()

);

alter sequence post_version_id_sequence owned by post_version.id;

create trigger update_post_version_modified before update on post_version for each row execute procedure update_modified_column();



-- ----------------------
--        Functions
-- ----------------------

-- Handle modified timestamp
----------------------------

create or replace function update_modified_column() 
returns trigger as $$
begin
    new.modified = now();
    return new; 
end;
$$ language 'plpgsql';