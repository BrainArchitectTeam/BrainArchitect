<?php

/**
 * Description of Security
 *
 * @author Frantisek Toman
 * @copyright Frantisek Toman, CTU/Faculty of Information Technology
 */

namespace BrainArchitect\Security;

class SecurityHelper {

    const SALT = 'B!~#@';

    /**
     * Generate password hash
     * @param type $password
     * @return type 
     */
    public static function calculatePasswordHash($password) {
        return sha1($password . str_repeat('Brain Architect Secure Hash Salt' . self::SALT, 10));
    }

    /**
     * Generate activation code for user account
     * @param User $user
     * @return type 
     */
    public static function generateActivationCode($id, $username) {
        return sha1(self::SALT . $id . $username);
    }

    public static function generateRandomPassword() {

        $characters = "abcdefghijklmnopqrstuvwxyz";
        $punctuation = ".!";

        $output = '';

        $lengthChar = strlen($characters);

        for ($i = 0; $i < 10; $i++) {
            $output .= $characters[rand() % $lengthChar];
        }

        $output[rand() % strlen($output)] = $punctuation[rand() % strlen($punctuation)];

        return $output;
    }
    
    public static function calculateResetPasswordRequest($id, $time) {
        return sha1( $time . $id . str_repeat('@!~#%^&', 10) );
    }

}
