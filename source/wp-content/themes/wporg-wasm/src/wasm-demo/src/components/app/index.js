/**
 * WordPress dependencies
 */
import { useState, useRef } from '@wordpress/element';
import safeAddQueryArgs from '../../safe-add-query-args';

/**
 * Internal dependencies
 */
import SetupStep from './setup-step';
import SandboxStep from './sandbox-step';

const STEP_SETUP = 'STEP_SETUP';
const STEP_SANDBOX = 'STEP_SANDBOX';

export default function WasmDemoApp() {
	const ref = useRef();
	const [step, _setStep] = useState(
		() =>
			new URL(window.location.href).searchParams.get('step') || STEP_SETUP
	);
	const [bootedAtLeastOnce, setBootedAtLeastOnce] = useState(
		step === STEP_SANDBOX
	);
	function setStep(nextStep) {
		if (!bootedAtLeastOnce) {
			setBootedAtLeastOnce(nextStep === STEP_SANDBOX);
		}
		_setStep(nextStep);
		window.history.pushState(
			{},
			'',
			safeAddQueryArgs(window.location.href, { step: nextStep })
		);
	}

	return (
		<div>
			{step === STEP_SETUP && (
				<SetupStep onSubmit={() => setStep(STEP_SANDBOX)} />
			)}
			{bootedAtLeastOnce && (
				<SandboxStep
					onClickBack={() => setStep(STEP_SETUP)}
					ref={ref}
				/>
			)}
		</div>
	);
}
