---
title: Verify Commit Signatures
sidebar_label: "Verify Commit Signatures"
# sidebar_position: 4
slug: "verivy-commit-signatures"
tags:
    - tutorial
    - guide
# pagination_next: tail
---

## Setting your username and email in Git

```bash
git config --global user.name "YOUR USERNAME"
```

```bash
git config --global user.email "YOUR EMAIL"
```

## Generating GPG keys

:::tip NOTE
Before generating a new GPG key, make sure you've verified your email address. If you haven't verified your email address, you won't be able to sign commits and tags with GPG. For more information, see "Verifying your email address".
:::

```bash
gpg --full-generate-key
```

```bash
Please select what kind of key you want:
   (1) RSA and RSA
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (9) ECC (sign and encrypt) *default*
  (10) ECC (sign only)
  (14) Existing key from card
```

Select 1 for RSA and RSA (default) as it is the most popular option

Select 4096 because it is the most secure option

Select 1y (it means that the key will expire in 1 year)

Type y and press Enter

Type your name and press Enter

Type your email address and press Enter

Type your comment and press Enter

Type O and press Enter

Type your passphrase and press Enter. This passphrase is used to protect your private key, and you will be asked to provide it every time you will sign or encrypt anything. So make sure that it is strong enough.

Type your passphrase again and press Enter

Move your mouse randomly and then type y and press Enter

```bash
gpg --list-secret-keys --keyid-format=long
```

## Exporting GPG public key

Amazing, our key is ready waiting for us to export it. To get the GPG public key I will need the KEY_ID, which is the part after / from the sec line, so in my case it is EF1438B66E632694. Now we can export the public key with the following command:

```bash
gpg --armor --export EF1438B66E632694
```

The output will be the public key in ASCII format, which can be shared with others and also added to GitHub, GitLab, etc. To set GPG key on GitHub, you need to go to GitHub website and into Settings -> SSH and GPG keys -> New GPG key and paste the public key that you exported.

## Set GPG key to work with Git

There are two ways of setting GPG key to work with Git. The first way is to set it globally and the second way is to set it per repository.

In most cases you will have only one GPG key, so you can set it globally with the following command:

```bash
git config --global commit.gpgsign true
git config --global user.signingkey EF1438B66E632694
```