/// ProofKit — Proof of Skill Portfolio
/// Tatum x Walrus Hackathon 2025
///
/// Mint SkillBadge NFTs on Sui. Each badge stores a Walrus blob ID
/// pointing to the developer's proof file stored on decentralised storage.

module skill_portfolio::skill_portfolio {

    use std::string::{Self, String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::display;
    use sui::package;

    // ── One-time witness for Display ──────────────────────────────────────
    public struct SKILL_PORTFOLIO has drop {}

    // ── Core object ───────────────────────────────────────────────────────
    /// A SkillBadge is an NFT owned by the developer.
    /// It attests a skill claim backed by a Walrus proof file.
    public struct SkillBadge has key, store {
        id:              UID,
        skill_name:      String,   // e.g. "Solidity", "React", "Move"
        category:        String,   // Smart Contracts / Frontend / Backend / DevOps / AI/ML / Other
        walrus_blob_id:  String,   // Content-addressed proof on Walrus storage
        description:     String,   // Developer's own explanation
        github_url:      String,   // Optional repo URL
        minted_at:       u64,      // Timestamp in milliseconds
        owner:           address,
    }

    // ── Events ────────────────────────────────────────────────────────────
    public struct BadgeMinted has copy, drop {
        badge_id:       ID,
        skill_name:     String,
        category:       String,
        walrus_blob_id: String,
        owner:          address,
        minted_at:      u64,
    }

    public struct BadgeBurned has copy, drop {
        badge_id: ID,
        owner:    address,
    }

    // ── Init ──────────────────────────────────────────────────────────────
    /// Sets up the Sui Display standard so wallets/explorers render
    /// SkillBadge objects with a readable name, description, and links.
    fun init(otw: SKILL_PORTFOLIO, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);

        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"category"),
            string::utf8(b"walrus_blob_id"),
            string::utf8(b"github_url"),
            string::utf8(b"project_url"),
            string::utf8(b"creator"),
        ];

        let values = vector[
            string::utf8(b"{skill_name}"),
            string::utf8(b"{description}"),
            string::utf8(b"{category}"),
            string::utf8(b"{walrus_blob_id}"),
            string::utf8(b"{github_url}"),
            string::utf8(b"https://proof-of-skill.vercel.app"),
            string::utf8(b"ProofKit"),
        ];

        let mut disp = display::new_with_fields<SkillBadge>(&publisher, keys, values, ctx);
        display::update_version(&mut disp);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(disp, tx_context::sender(ctx));
    }

    // ── Entry functions ───────────────────────────────────────────────────

    /// Mint a new SkillBadge and send it to the caller's wallet.
    ///
    /// skill_name     — name of the skill (e.g. "Move")
    /// category       — one of the supported categories
    /// walrus_blob_id — blob ID returned by Walrus after uploading proof
    /// description    — developer's explanation of their work
    /// github_url     — optional GitHub URL (pass empty bytes if none)
    /// clock          — Sui system clock (object ID: 0x6)
    public entry fun mint_badge(
        skill_name:     vector<u8>,
        category:       vector<u8>,
        walrus_blob_id: vector<u8>,
        description:    vector<u8>,
        github_url:     vector<u8>,
        clock:          &Clock,
        ctx:            &mut TxContext,
    ) {
        let sender     = tx_context::sender(ctx);
        let minted_at  = clock::timestamp_ms(clock);

        let badge = SkillBadge {
            id:             object::new(ctx),
            skill_name:     string::utf8(skill_name),
            category:       string::utf8(category),
            walrus_blob_id: string::utf8(walrus_blob_id),
            description:    string::utf8(description),
            github_url:     string::utf8(github_url),
            minted_at,
            owner:          sender,
        };

        event::emit(BadgeMinted {
            badge_id:       object::id(&badge),
            skill_name:     badge.skill_name,
            category:       badge.category,
            walrus_blob_id: badge.walrus_blob_id,
            owner:          sender,
            minted_at,
        });

        transfer::transfer(badge, sender);
    }

    /// Update the description on a badge you own.
    public entry fun update_description(
        badge:           &mut SkillBadge,
        new_description: vector<u8>,
        _ctx:            &mut TxContext,
    ) {
        badge.description = string::utf8(new_description);
    }

    /// Permanently delete a badge you own.
    public entry fun burn_badge(badge: SkillBadge, ctx: &mut TxContext) {
        event::emit(BadgeBurned { badge_id: object::id(&badge), owner: tx_context::sender(ctx) });
        let SkillBadge { id, skill_name:_, category:_, walrus_blob_id:_,
            description:_, github_url:_, minted_at:_, owner:_ } = badge;
        object::delete(id);
    }

    // ── View functions ────────────────────────────────────────────────────
    public fun skill_name(b: &SkillBadge):     &String { &b.skill_name }
    public fun category(b: &SkillBadge):       &String { &b.category }
    public fun walrus_blob_id(b: &SkillBadge): &String { &b.walrus_blob_id }
    public fun description(b: &SkillBadge):    &String { &b.description }
    public fun github_url(b: &SkillBadge):     &String { &b.github_url }
    public fun minted_at(b: &SkillBadge):      u64     { b.minted_at }
    public fun owner(b: &SkillBadge):          address { b.owner }
}
