/// Wallet Tagging Contract
/// 
/// This contract allows users to tag wallet addresses with custom labels
/// and flag suspicious addresses on-chain. Tags are public and immutable.
/// 
/// Features:
/// - Add custom tags to any wallet address
/// - Flag wallets as suspicious
/// - Query tags for an address
/// - Track who tagged an address

#[starknet::contract]
mod WalletTagging {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess,
        Map, Vec, VecTrait, MutableVecTrait
    };

    /// Tag structure representing a single tag on an address
    #[derive(Drop, Copy, Serde, starknet::Store)]
    struct Tag {
        tagger: ContractAddress,      // Who created this tag
        target: ContractAddress,       // Address being tagged
        tag_type: felt252,             // Type of tag (e.g., 'trusted', 'scam')
        timestamp: u64,                // When tag was created
        is_flag: bool,                 // Whether this is a suspicious flag
    }

    /// Contract storage
    #[storage]
    struct Storage {
        // Mapping: target_address => array of tag indices
        address_tags: Map<ContractAddress, Vec<u64>>,
        
        // Global array of all tags
        all_tags: Vec<Tag>,
        
        // Counter for tag IDs
        next_tag_id: u64,
        
        // Mapping: address => flag count (number of times flagged as suspicious)
        flag_counts: Map<ContractAddress, u32>,
        
        // Contract owner
        owner: ContractAddress,
    }

    /// Events
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        TagAdded: TagAdded,
        AddressFlagged: AddressFlagged,
    }

    /// Event emitted when a new tag is added
    #[derive(Drop, starknet::Event)]
    struct TagAdded {
        tag_id: u64,
        tagger: ContractAddress,
        target: ContractAddress,
        tag_type: felt252,
    }

    /// Event emitted when an address is flagged as suspicious
    #[derive(Drop, starknet::Event)]
    struct AddressFlagged {
        flagger: ContractAddress,
        target: ContractAddress,
        flag_count: u32,
    }

    /// Constructor
    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
        self.next_tag_id.write(0);
    }

    /// External functions
    #[abi(embed_v0)]
    impl WalletTaggingImpl of super::IWalletTagging<ContractState> {
        /// Add a tag to a wallet address
        /// 
        /// # Arguments
        /// * `target` - Address to tag
        /// * `tag_type` - Type of tag (e.g., 'exchange', 'dex', 'personal')
        /// 
        /// # Returns
        /// * Tag ID
        fn add_tag(
            ref self: ContractState,
            target: ContractAddress,
            tag_type: felt252
        ) -> u64 {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            let tag_id = self.next_tag_id.read();

            // Create new tag
            let new_tag = Tag {
                tagger: caller,
                target: target,
                tag_type: tag_type,
                timestamp: timestamp,
                is_flag: false,
            };

            // Store tag in global array
            self.all_tags.append().write(new_tag);

            // Add tag ID to address mapping
            self.address_tags.entry(target).append().write(tag_id);

            // Increment tag ID counter
            self.next_tag_id.write(tag_id + 1);

            // Emit event
            self.emit(TagAdded {
                tag_id: tag_id,
                tagger: caller,
                target: target,
                tag_type: tag_type,
            });

            tag_id
        }

        /// Flag an address as suspicious
        /// 
        /// # Arguments
        /// * `target` - Address to flag
        fn flag_address(ref self: ContractState, target: ContractAddress) {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            let tag_id = self.next_tag_id.read();

            // Create flag tag
            let flag_tag = Tag {
                tagger: caller,
                target: target,
                tag_type: 'suspicious',
                timestamp: timestamp,
                is_flag: true,
            };

            // Store flag
            self.all_tags.append().write(flag_tag);
            self.address_tags.entry(target).append().write(tag_id);
            self.next_tag_id.write(tag_id + 1);

            // Increment flag count
            let current_flags = self.flag_counts.entry(target).read();
            self.flag_counts.entry(target).write(current_flags + 1);

            // Emit event
            self.emit(AddressFlagged {
                flagger: caller,
                target: target,
                flag_count: current_flags + 1,
            });
        }

        /// Get number of tags for an address
        /// 
        /// # Arguments
        /// * `target` - Address to query
        /// 
        /// # Returns
        /// * Number of tags
        fn get_tag_count(self: @ContractState, target: ContractAddress) -> u64 {
            self.address_tags.entry(target).len()
        }

        /// Get flag count for an address
        /// 
        /// # Arguments
        /// * `target` - Address to query
        /// 
        /// # Returns
        /// * Number of flags
        fn get_flag_count(self: @ContractState, target: ContractAddress) -> u32 {
            self.flag_counts.entry(target).read()
        }

        /// Get tag by ID
        /// 
        /// # Arguments
        /// * `tag_id` - Tag ID to retrieve
        /// 
        /// # Returns
        /// * Tag struct
        fn get_tag(self: @ContractState, tag_id: u64) -> Tag {
            self.all_tags.at(tag_id).read()
        }
    }
}

/// Interface definition
#[starknet::interface]
trait IWalletTagging<TContractState> {
    fn add_tag(ref self: TContractState, target: ContractAddress, tag_type: felt252) -> u64;
    fn flag_address(ref self: TContractState, target: ContractAddress);
    fn get_tag_count(self: @TContractState, target: ContractAddress) -> u64;
    fn get_flag_count(self: @TContractState, target: ContractAddress) -> u32;
    fn get_tag(self: @TContractState, tag_id: u64) -> WalletTagging::Tag;
}