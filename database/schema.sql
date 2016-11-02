
-- ----------------------
--         Tables
-- ----------------------

-- Accounts
-----------

drop sequence account_id_sequence;
drop table account;
drop trigger update_account_modified;

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

drop sequence post_id_sequence;
drop table post;
drop trigger update_post_modified;

create sequence post_id_sequence;

create table post(
    id int default nextval('post_id_sequence') primary key,
    slug text not null,
    version int not null,
    created timestamp with time zone default now(),
    modified timestamp with time zone default now()
);

alter sequence post_id_sequence owned by post.id;

create trigger update_post_modified before update on post for each row execute procedure update_modified_column();


-- Post Versions
----------------

drop sequence post_version_id_sequence;
drop table post_version;
drop trigger update_post_version_modified;

create sequence post_version_id_sequence;

create table post_version(
    id int default nextval('post_id_sequence') primary key,
    post int references post on update cascade,
    author int references account on update cascade,
    body text,
    created timestamp with time zone default now(),
    modified timestamp with time zone default now()

);

alter sequence post_version_id_sequence owned by post_version.id;

create trigger update_post_version_modified before update on post_version for each row execute procedure update_modified_column();


-- Post -> Version
------------------

alter table post add constraint versionfk foreign key (version) references post_version;


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