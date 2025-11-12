'use client';

import { AssistantProvider, useAssistantContext } from '@/lib/assistant/context';
import { useAssistant, SendMessageArgs } from '@/lib/assistant/useAssistant';
import { Composer } from '@/components/assistant/Composer';
import { Thread } from '@/components/assistant/Thread';
import { SidePanel } from '@/components/assistant/SidePanel';
import { Action, AssistantMessage } from '@/lib/assistant/types';
import { AttachPicker } from '@/components/assistant/Modals/AttachPicker';
import { ImportDialog } from '@/components/assistant/Modals/ImportDialog';
import { NewBriefingDialog } from '@/components/assistant/Modals/NewBriefingDialog';
import { CreateRuleDrawer } from '@/components/assistant/Modals/CreateRuleDrawer';
import { NudgeDialog } from '@/components/assistant/Modals/NudgeDialog';
import { OpenInDrawer } from '@/components/assistant/Modals/OpenInDrawer';
import { ScheduleDrawer } from '@/components/assistant/Modals/ScheduleDrawer';
import { SimulateDrawer } from '@/components/assistant/Modals/SimulateDrawer';
import { useState } from 'react';

function AssistantPageContent() {
  const [value, setValue] = useState('');
  const { mode, chips, attachments } = useAssistantContext();
  const { messages, loading, sendMessage, executeAction, execLogs } = useAssistant();

  const [modal, setModal] = useState<string | null>(null);

  const handleSubmit = () => {
    const activeChips = chips.filter((c) => c.active).map((c) => c.id);
    const args: SendMessageArgs = { content: value, mode, chips: activeChips, attachments };
    sendMessage(args);
    setValue('');
  };

  const handleAction = (message: AssistantMessage, action: Action) => {
    if (action.type === 'nudge') {
      setModal('nudge');
    } else {
      executeAction(action);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'create-event':
      case 'record-payment':
      case 'schedule-bill':
        setModal('schedule');
        break;
      case 'add-transaction':
        injectMessage({
          role: 'assistant',
          kind: 'editor',
          form: {
            id: 'quick-add-txn',
            title: 'Add transaction',
            fields: [
              { id: 'amount', label: 'Amount', type: 'currency' },
              { id: 'category', label: 'Category', type: 'text' },
            ],
          },
        });
        break;
      case 'send-nudge':
        setModal('nudge');
        break;
      case 'scan-receipt':
        setModal('import');
        break;
      default:
        setValue((prev) => `${prev} ${actionId}`.trim());
        break;
    }
  };
  
  const { injectMessage } = useAssistant();

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex h-full flex-col lg:col-span-2">
        <Thread messages={messages} loading={loading} onAction={handleAction} execLogs={execLogs} />
        <div className="mt-auto px-4 pb-4">
          <Composer value={value} onChange={setValue} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
      <div className="hidden h-full lg:block">
        <SidePanel onQuickAction={handleQuickAction} />
      </div>
      <AttachPicker open={modal === 'attach'} onOpenChange={() => setModal(null)} />
      <ImportDialog open={modal === 'import'} onOpenChange={() => setModal(null)} payload={{type: 'receipt', confidence: 0.9, proposedActions: []}} />
      <NewBriefingDialog open={modal === 'briefing'} onOpenChange={() => setModal(null)} />
      <CreateRuleDrawer open={modal === 'rule'} onOpenChange={() => setModal(null)} />
      <NudgeDialog open={modal === 'nudge'} onOpenChange={() => setModal(null)} />
      <OpenInDrawer open={modal === 'open-in'} onOpenChange={() => setModal(null)} />
      <ScheduleDrawer open={modal === 'schedule'} onOpenChange={() => setModal(null)} />
      <SimulateDrawer open={modal === 'simulate'} onOpenChange={() => setModal(null)} />
    </div>
  );
}

export default function AssistantPage() {
  return (
    <AssistantProvider>
      <AssistantPageContent />
    </AssistantProvider>
  );
}
