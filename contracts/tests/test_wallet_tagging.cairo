/// Unit tests for WalletTagging contract
/// 
/// These tests verify the core functionality of the tagging system

#[cfg(test)]
mod tests {
    use super::super::wallet_tagging::{
        WalletTagging, IWalletTaggingDispatcher, IWalletTaggingDispatcherTrait
    };
    use starknet::{ContractAddress, contract_address_const};
    use starknet::testing::{set_caller_address, set_block_timestamp};

    /// Helper function to deploy the contract
    fn deploy_contract() -> IWalletTaggingDispatcher {
        let owner = contract_address_const::<'owner'>();
        let contract = WalletTagging::deploy(owner);
        IWalletTaggingDispatcher { contract_address: contract }
    }

    #[test]
    fn test_add_tag() {
        // Deploy contract
        let dispatcher = deploy_contract();
        
        // Set up test addresses
        let tagger = contract_address_const::<'tagger'>();
        let target = contract_address_const::<'target'>();
        
        set_caller_address(tagger);
        set_block_timestamp(1000);

        // Add a tag
        let tag_id = dispatcher.add_tag(target, 'exchange');

        // Verify tag was added
        assert(tag_id == 0, 'First tag should have ID 0');
        
        // Verify tag count
        let tag_count = dispatcher.get_tag_count(target);
        assert(tag_count == 1, 'Should have 1 tag');
        
        // Retrieve and verify tag
        let tag = dispatcher.get_tag(tag_id);
        assert(tag.tagger == tagger, 'Wrong tagger');
        assert(tag.target == target, 'Wrong target');
        assert(tag.tag_type == 'exchange', 'Wrong tag type');
        assert(tag.is_flag == false, 'Should not be a flag');
    }

    #[test]
    fn test_flag_address() {
        // Deploy contract
        let dispatcher = deploy_contract();
        
        // Set up test addresses
        let flagger = contract_address_const::<'flagger'>();
        let target = contract_address_const::<'suspicious'>();
        
        set_caller_address(flagger);

        // Flag the address
        dispatcher.flag_address(target);

        // Verify flag count
        let flag_count = dispatcher.get_flag_count(target);
        assert(flag_count == 1, 'Should have 1 flag');
        
        // Flag again from same address
        dispatcher.flag_address(target);
        let new_flag_count = dispatcher.get_flag_count(target);
        assert(new_flag_count == 2, 'Should have 2 flags');
    }

    #[test]
    fn test_multiple_tags() {
        // Deploy contract
        let dispatcher = deploy_contract();
        
        let tagger1 = contract_address_const::<'tagger1'>();
        let tagger2 = contract_address_const::<'tagger2'>();
        let target = contract_address_const::<'target'>();

        // Add multiple tags from different taggers
        set_caller_address(tagger1);
        dispatcher.add_tag(target, 'dex');
        
        set_caller_address(tagger2);
        dispatcher.add_tag(target, 'trusted');

        // Verify tag count
        let tag_count = dispatcher.get_tag_count(target);
        assert(tag_count == 2, 'Should have 2 tags');
    }

    #[test]
    fn test_tag_retrieval() {
        // Deploy contract
        let dispatcher = deploy_contract();
        
        let tagger = contract_address_const::<'tagger'>();
        let target = contract_address_const::<'target'>();
        
        set_caller_address(tagger);
        set_block_timestamp(5000);

        // Add tag
        let tag_id = dispatcher.add_tag(target, 'personal');

        // Retrieve tag
        let tag = dispatcher.get_tag(tag_id);
        
        // Verify all fields
        assert(tag.tagger == tagger, 'Tagger mismatch');
        assert(tag.target == target, 'Target mismatch');
        assert(tag.tag_type == 'personal', 'Tag type mismatch');
        assert(tag.timestamp == 5000, 'Timestamp mismatch');
        assert(tag.is_flag == false, 'Flag status mismatch');
    }
}